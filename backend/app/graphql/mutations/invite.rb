module Mutations
	class Invite < GraphQL::Schema::Mutation
		include Authorize
		graphql_name "Invite"

		argument :group_id, ID, required: true, loads: Group
		argument :user_email, String, required: true

		field :success, Boolean, null: false

		def resolve(group:, user_email:)
			user = User.find_by(email: user_email);
			return {success: false} if(user_email == context[:current_user].email || user.nil?)

			group.users << user;

			if group.save
				{
					success: true
				}
			else
				{
					success: false
				}
			end
		end

		def load_group(id)
  			Group.joins(:users).find(id);
		end

		private

		def authorized?(group:, user_email:)
			group_authorized?(group, 0, context);
		end

		
	end
end