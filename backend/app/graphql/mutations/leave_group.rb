module Mutations
	class LeaveGroup < GraphQL::Schema::Mutation
		graphql_name "LeaveGroup"

		argument :group_id, ID, required: true

		field :success, Boolean, null: false

		def resolve(group_id:)
			# group = Group.find(group_id).users
			member = Member.where(user_id: context[:current_user].id, group_id: group_id, accepted: true).take


			if member.destroy
				group = Group.includes(:users).find(group_id);
				group.destroy if group.users.size == 0;
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
			Member.where(user_id: context[:current_user].id, group_id: group_id, accepted: true).exists?();
		end

		
	end
end