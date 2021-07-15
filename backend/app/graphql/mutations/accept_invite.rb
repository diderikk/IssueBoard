module Mutations
	class AcceptInvite < GraphQL::Schema::Mutation
		graphql_name "AcceptInvite"

		argument :group_id, ID, required: true

		field :success, Boolean, null: false

		def resolve(group_id:)
			# group = Group.find(group_id).users
			member = Member.where(user_id: context[:current_user].id, group_id: group_id, accepted: false).take

			if member.update(accepted: true)
				{
					success: true
				}
			else
				{
					success: false
				}
			end
		end

		private

		def authorized?(group_id:)
			Member.where(user_id: context[:current_user].id, group_id: group_id, accepted: false).exists?();
		end

		
	end
end